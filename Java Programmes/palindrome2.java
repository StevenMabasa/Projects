import java.util.Scanner;

public class palindrome2 {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int num = scanner.nextInt();
            int duplicate = num;
            int remainder;
            int reverse = 0;

            while (duplicate != 0) {        //reversing the number
                remainder = duplicate % 10;
                reverse = (reverse*10) + remainder;
                duplicate /= 10;       //removing the last digit
            }

            System.out.println(reverse);

            if (reverse == num) {
                System.out.println("YES");
            }

            else {
                System.out.println("NO");
            }
        }
    }
}
